import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { GiSpeaker } from "react-icons/gi";
import { FaMicrophone } from "react-icons/fa";

function App() {
    const [languages, setLanguages] = useState([
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'es', name: 'Spanish' },
        { code: 'de', name: 'German' },
        { code: 'hi', name: 'Hindi' },
        { code: 'zh', name: 'Chinese' }
    ]);
    const [to, setTo] = useState('fr');
    const [from, setFrom] = useState('en');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);
    const [history, setHistory] = useState([]);

    const translate = () => {
        if (!input.trim()) {
            alert("Please enter text to translate.");
            return;
        }

        const requestData = {
            text: input,
            sourceLang: from,
            targetLang: to
        };

        axios.post('/api/translate/text', requestData)
            .then(res => {
                const translatedText = Object.keys(res.data)[0];
                setOutput(translatedText);
                setAudioUrl(res.data[translatedText]);
            })
            .catch(err => console.error("Translation Error:", err));
    };

    const fetchHistory = () => {
        axios.get('/api/audios/recent', {
            params: { bucketName: 'live-translator-audio-bucket' }
        })
            .then(res => setHistory(res.data))
            .catch(err => console.error("History Fetch Error:", err));
    };

    const startSpeechRecognition = () => {
        const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
        recognition.lang = from;
        recognition.start();

        recognition.onresult = (event) => {
            setInput(event.results[0][0].transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
        };
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="App">
            <div>
                <label>From:</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>

                <label>To:</label>
                <select value={to} onChange={(e) => setTo(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Enter Text:</label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <textarea
            cols="50"
            rows="5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
                    <button onClick={startSpeechRecognition} title="Speak">
                        <FaMicrophone />
                    </button>
                </div>
            </div>

            <div>
                <label>Translated Text:</label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <textarea cols="50" rows="5" value={output} readOnly />
                    <button onClick={() => new Audio(audioUrl).play()} title="Play Audio">
                        <GiSpeaker />
                    </button>
                </div>
            </div>


            <div>
                <button onClick={translate}>Translate</button>
                <button onClick={fetchHistory}>Refresh History</button>
            </div>

            <div>
                <h3>Recent Translations</h3>
                <ol style={{ listStylePosition: "inside", display: "inline-block", textAlign: "left", padding: "0" }}>
                    {history.map((url, index) => (
                        <li key={index}>
                            <audio controls>
                                <source src={url} type="audio/mpeg" />
                            </audio>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default App;
