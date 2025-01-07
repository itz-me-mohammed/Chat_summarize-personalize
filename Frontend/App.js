import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [participantMessages, setParticipantMessages] = useState('');
    const [summary, setSummary] = useState('');
    const [centralReply, setCentralReply] = useState('');
    const [participantContexts, setParticipantContexts] = useState('');
    const [personalizedReplies, setPersonalizedReplies] = useState([]);

    const handleSummarize = async () => {
        try {
            const response = await axios.post('/api/summarize', {
                messages: participantMessages.split('\n'),
            });
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Error summarizing messages:', error);
        }
    };

    const handlePersonalize = async () => {
        try {
            const contexts = participantContexts.split('\n');
            const response = await axios.post('/api/personalize', {
                central_reply: centralReply,
                participant_contexts: contexts,
            });
            setPersonalizedReplies(response.data.replies);
        } catch (error) {
            console.error('Error personalizing replies:', error);
        }
    };

    return (
        <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>1:N Chat Summarizer</h1>

            <section>
                <h2>Step 1: Input Participant Messages</h2>
                <textarea
                    rows="10"
                    style={{ width: '100%' }}
                    placeholder="Enter participant messages, one per line."
                    value={participantMessages}
                    onChange={(e) => setParticipantMessages(e.target.value)}
                ></textarea>
                <button onClick={handleSummarize} style={{ marginTop: '10px' }}>
                    Summarize Messages
                </button>
                {summary && (
                    <div>
                        <h3>Summary:</h3>
                        <p>{summary}</p>
                    </div>
                )}
            </section>

            <section>
                <h2>Step 2: Input Central Reply & Participant Contexts</h2>
                <textarea
                    rows="3"
                    style={{ width: '100%' }}
                    placeholder="Enter central reply here."
                    value={centralReply}
                    onChange={(e) => setCentralReply(e.target.value)}
                ></textarea>
                <textarea
                    rows="10"
                    style={{ width: '100%', marginTop: '10px' }}
                    placeholder="Enter participant contexts, one per line."
                    value={participantContexts}
                    onChange={(e) => setParticipantContexts(e.target.value)}
                ></textarea>
                <button onClick={handlePersonalize} style={{ marginTop: '10px' }}>
                    Generate Personalized Replies
                </button>
                {personalizedReplies.length > 0 && (
                    <div>
                        <h3>Personalized Replies:</h3>
                        <ul>
                            {personalizedReplies.map((reply, index) => (
                                <li key={index}>{reply}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}

export default App;
