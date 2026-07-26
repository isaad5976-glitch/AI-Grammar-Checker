/*const btn = document.getElementById("checkBtn");
const input = document.getElementById("userInput");
const result = document.getElementById("result");

//const API_URL = "https://router.huggingface.co/v1/chat/completions";
//"https://api-inference.huggingface.co/models/visheratin/t5-efficient-mini-grammar-correction";

const TOKEN = "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";
//from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

//tokenizer = AutoTokenizer.from_pretrained("visheratin/t5-efficient-mini-grammar-correction")
//model = AutoModelForSeq2SeqLM.from_pretrained("visheratin/t5-efficient-mini-grammar-correction", device_map="auto")
const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "openai/gpt-oss-120b:fastest",
        messages: [
            {
                role: "system",
                content: "You are an English grammar correction assistant. Return only the corrected sentence."
            },
            {
                role: "user",
                content: original
            }
        ]
    })
});

const data = await response.json();

result.innerHTML = `
<h3>Original</h3>
<p>${original}</p>

<h3>Corrected</h3>
<p>${data.choices[0].message.content}</p>
`;

btn.addEventListener("click", async () => {
    const original = input.value.trim();

    if (!original) {
        result.innerHTML = "Please enter some text to check.";
        return;
    }

    result.innerHTML = "Analyzing...";
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `text=${encodeURIComponent(original)}&language=en-US`
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.matches && data.matches.length > 0) {
            let corrected = original;
            let issues = [];
            
            const sortedMatches = [...data.matches].sort((a, b) => b.offset - a.offset);
            
            sortedMatches.forEach(match => {
                if (match.replacements && match.replacements.length > 0) {
                    const replacement = match.replacements[0].value;
                    const start = match.offset;
                    const end = match.offset + match.length;
                    
                    if (replacement && replacement.length > 1 && replacement !== 'ie') {
                        corrected = corrected.substring(0, start) + replacement + corrected.substring(end);
                        issues.push({
                            original: original.substring(start, end),
                            corrected: replacement,
                            message: match.message
                        });
                    }
                }
            });

            let resultHTML = `<strong>Original:</strong> ${original}<br>`;
            resultHTML += `<strong>Corrected:</strong> ${corrected}<br><br>`;
            
            if (issues.length > 0) {
                resultHTML += `<strong>Issues fixed:</strong><ul>`;
                issues.forEach(issue => {
                    resultHTML += `<li>"${issue.original}" → "${issue.corrected}" - ${issue.message}</li>`;
                });
                resultHTML += `</ul>`;
            }
            
            result.innerHTML = resultHTML;
        } else {
            result.innerHTML = "✅ No grammar issues found!";
        }
    } catch (error) {
        console.error("Error:", error);
        result.innerHTML = "❌ Error checking grammar. Please try again.";
    } finally {
        btn.disabled = false;
    }
});  */

const btn = document.getElementById("checkBtn");
const input = document.getElementById("userInput");
const result = document.getElementById("result");

// Paste your Hugging Face token here
const TOKEN = "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";

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
