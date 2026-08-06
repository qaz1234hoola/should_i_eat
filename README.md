# 🥗 Should-i-eatzz??

> 👋 **Hello folks!!**
> 
> Are you the kind of person, who has to go through every ingredient, before buying what you put into your gut? 🥑  
> If you are, **you have come to the right place!!** 🎉

---

## 🧐 How It Works

📸 **Just upload the photo ingredient list** of the product you were tempted to taste, and **should-i-eat** will tell you all about it (what it is, pros and cons)! 

⚖️ Should you eat it or not? **Its on you!!**

🩺 You can also **add in a medical condition** to check if the product is safe for you!

💬 On a constant look-out to make this website more useful and interesting, **would love your feedback!!**

Try it out [here](https://should-i-eatzz.vercel.app)!

---

## 📝 Developer's Note

* 🤖 **Models Used:**
  * `qwen/qwen3.6-27b` model for image processing and ingredient analysis
  * `openai/gpt-oss-120b` for medical condition analysis

* 💡 **A quick observation:** For the Qwen vision model, the quality of the image must be good—if there is excess light or unclear writing, it fails to give the response in the required JSON format.

* ⚠️ **An error which I found (working on it):** *"refined flour(maida) is easy to digest"* (hallucinations man!!)

---

## 🚀 Features

- **Label Vision Analysis:** Instant OCR and ingredient extraction from uploaded product packaging images.
- **Personalized Health Context:** Evaluates ingredient safety against user-provided medical conditions.
- **Pros & Cons Breakdown:** Identifies key health risks, added sugars, preservatives, and dietary benefits.
- **Structured JSON Pipeline:** Custom backend sanitization handles reasoning tokens (`<think>`) and code fences for clean frontend rendering.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Frontend:** React, Tailwind CSS
- **AI Infrastructure:** [Groq SDK](https://groq.com/)
- **Vision Model:** `qwen/qwen3.6-27b`
- **Medical Analysis Model:** `openai/gpt-oss-120b`

---

## 💻 Getting Started

### Prerequisites

- Node.js 18.x or higher
- A [Groq API Key](https://console.groq.com/)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone [https://github.com/qaz1234hoola/should_i_eat.git](https://github.com/qaz1234hoola/should_i_eat.git)
cd should_i_eat
npm install

```

---

### Step 2: Environment Setup

```markdown

Create a `.env.local` file in the root directory:

GROQ_API_KEY=your_groq_api_key_here

```

---

### Step 3: Running the Development Server (Open http://localhost:3000 in your browser.)

```markdown
Start the Next.js development server: http://localhost:3000 after:


npm run dev

```

---

### 📁 Project Structure

```markdown


├── src/
│   └── app/
│       ├── api/
│       │   └── analyze-ingredients/
│       │       └── route.js        # Groq vision & medical analysis API route
│       ├── layout.js               # Root layout
│       └── page.js                 # Image upload & results interface
├── public/                         # Static assets
├── .env.local                      # Environment variables (git-ignored)
└── package.json

