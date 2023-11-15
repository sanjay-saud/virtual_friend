const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
require('dotenv').config();


const API_KEY = process.env.OPENAI_API_KEY


function constructPrompt(userMessage) {
    const scenario = "You are a sophisticated AI coding assistant with extensive knowledge in software development,your name is james debugging, and algorithm design. Your role is to assist with programming queries, provide code examples, explain complex concepts in simple terms, and guide users towards best practices in software development.";
    const combinedPrompt = `${scenario} A user has asked: ${userMessage}`;
    return combinedPrompt;
}

app.post('/completions', async (req, res) => {

    //using constructPrompt to process the user message
    const prompt = constructPrompt(req.body.message);

    const options = {
        method:"POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            model : "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
            max_tokens: 200,
        })
    }

    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        res.send(data)
    }
    catch (error) { 
        console.error(error)
    }
}
)

app.listen(PORT ,()=> console.log('Your server is running on PORT ' + PORT))





// mongodb+srv://subashsaud100:Subash980@clustercodepilot.uxam67v.mongodb.net/?retryWrites=true&w=majority