const output = document.getElementById("output");
const micBtn = document.getElementById("micBtn");
const pdfInput = document.getElementById("pdfInput");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-IN";
recognition.interimResults = false;

const synth = window.speechSynthesis;

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 1.3;
  utter.rate = 0.9;

  const voices = synth.getVoices();
  const female = voices.find(v =>
    v.name.toLowerCase().includes("female") ||
    v.name.toLowerCase().includes("zira") ||
    v.name.toLowerCase().includes("samantha")
  );
  if (female) utter.voice = female;

  synth.speak(utter);
}

micBtn.onclick = () => {
  output.innerText = "Listening...";
  recognition.start();
};

recognition.onresult = (event) => {
  const cmd = event.results[0][0].transcript.toLowerCase();
  output.innerText = "You said: " + cmd;

  if (!cmd.includes("annu")) {
    speak("Please say Annu first Boss");
    return;
  }

  if (cmd.includes("youtube")) {
    speak("Yes Boss, opening YouTube");
    window.open("https://youtube.com", "_blank");
  }

  else if (cmd.includes("google")) {
    speak("Opening Google Boss");
    window.open("https://google.com", "_blank");
  }

  else if (cmd.includes("pdf")) {
    speak("Boss, please select a PDF");
    pdfInput.click();
  }

  else if (cmd.includes("time")) {
    const now = new Date();
    speak(`Boss, time is ${now.getHours()} ${now.getMinutes()}`);
  }

  else {
    speak("Sorry Boss, command not understood");
  }
};

pdfInput.onchange = async () => {
  const file = pdfInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = async () => {
    const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      content.items.forEach(item => text += item.str + " ");
    }

    speak("Boss, PDF reading started");
    speak(text);
  };
};
