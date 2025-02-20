import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { GiSpeaker } from "react-icons/gi";
import { FaMicrophone } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";


function App() {
    const [languages, setLanguages] = useState([
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'bn', name: 'Bengali' },
        { code: 'te', name: 'Telugu' },
        { code: 'mr', name: 'Marathi' },
        { code: 'ta', name: 'Tamil' },
        { code: 'ur', name: 'Urdu' },
        { code: 'gu', name: 'Gujarati' },
        { code: 'kn', name: 'Kannada' },
        { code: 'or', name: 'Odia' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'pa', name: 'Punjabi' },
        { code: 'as', name: 'Assamese' },
        { code: 'ne', name: 'Nepali' },
        { code: 'si', name: 'Sinhala' },
        { code: 'zh', name: 'Chinese' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'it', name: 'Italian' },
        { code: 'ar', name: 'Arabic' },
        { code: 'nl', name: 'Dutch' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'pl', name: 'Polish' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'th', name: 'Thai' },
        { code: 'fa', name: 'Persian' },
        { code: 'he', name: 'Hebrew' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'el', name: 'Greek' },
        { code: 'cs', name: 'Czech' },
        { code: 'ro', name: 'Romanian' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'id', name: 'Indonesian' },
        { code: 'fi', name: 'Finnish' },
        { code: 'no', name: 'Norwegian' },
        { code: 'da', name: 'Danish' },
        { code: 'bg', name: 'Bulgarian' },
        { code: 'sr', name: 'Serbian' },
        { code: 'sk', name: 'Slovak' },
        { code: 'hr', name: 'Croatian' },
        { code: 'ms', name: 'Malay' }
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

        axios.post('https://live-translator-451219.df.r.appspot.com/api/translate/text', requestData)
            .then(res => {
                const translatedText = Object.keys(res.data)[0];
                setOutput(translatedText);
                setAudioUrl(res.data[translatedText]);
            })
            .catch(err => console.error("Translation Error:", err));
    };

    const fetchHistory = () => {
        axios.get('https://live-translator-451219.df.r.appspot.com/api/audios/recent', {
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
                <label style={{ fontWeight:"bold"}}>From:</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>

                <label style={{ fontWeight:"bold"}}>To:</label>
                <select value={to} onChange={(e) => setTo(e.target.value)}>
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ fontWeight:"bold"}}>Enter Text:</label>
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
                <button style={{ background:"lightgreen", padding:"10px"}} onClick={translate}>Translate</button>
            </div>

            <div>
                <label style={{ fontWeight:"bold"}}>Translated Text:</label>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <textarea cols="50" rows="5" value={output} readOnly />
                    <button onClick={() => new Audio(audioUrl).play()} title="Play Audio">
                        <GiSpeaker />
                    </button>
                </div>
            </div>

            <div>
                <h3>
                    Recent Translations
                    <button onClick={fetchHistory} style={{ marginLeft: "8px" }}>
                        <IoIosRefresh />
                    </button>
                </h3>

                <ol style={{ listStylePosition: "inside", display: "inline-block", textAlign: "left", padding: "0" }}>
                    {history?.map((url, index) => (
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
