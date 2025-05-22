const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("SpeechRecognition is not supported in this browser.");
} else {
  const r = new SpeechRecognition();
  r.continuous = false;
  r.interimResults = false;
  r.maxAlternatives = 1;

  r.onstart = function () {
    console.log("Speech recognition started");
    scrib.show("R is started");
  };

  r.onresult = async function (event) {
    const transcript = event.results[0][0].transcript;
    console.log("Transcript:", transcript);
    scrib.show(`You said: ${transcript}`);
    
    const result = await callGemini(transcript);
    scrib.show(result);
  };

  async function callGemini(text) {
    const body = {
      contents: [
        {
          parts: [{ text: text }]
        }
      ]
    };

    const API_KEY = 'AIzaSyDTbP0rY1_L4gAXziqctTdpO2W9kz4vItg'; // Use securely in production!
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    // Extract text safely from the Gemini response
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
  }

  r.start();
  console.log("started");
}

