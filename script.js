

const btn = document.getElementById("checkBtn");
const input = document.getElementById("userInput");
const result = document.getElementById("result");


const TOKEN = "";

const API_URL = "https://router.huggingface.co/v1/chat/completions";

btn.addEventListener("click", async () => {
    const original = input.value.trim();

    if (!original) {
        result.innerHTML = "Please enter some text.";
        return;
    }

    result.innerHTML = "🤖 AI is analyzing...";
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [
                    {
                        role: "system",
                        content: "You are a grammar correction assistant. Correct only grammar and spelling. Return only the corrected sentence."
                    },
                    {
                        role: "user",
                        content: original
                    }
                ]
            })
        });

        const data = await response.json();

        console.log(data); // Helps us debug

        if (!response.ok) {
            throw new Error(data.error?.message || "API Error");
        }

        const corrected = data.choices[0].message.content;

        result.innerHTML = `
            <h3>Original</h3>
            <p>${original}</p>

            <h3>Corrected</h3>
            <p>${corrected}</p>
        `;

    } catch (error) {
        console.error(error);
        result.innerHTML = `❌ ${error.message}`;
    }

    btn.disabled = false;
});
