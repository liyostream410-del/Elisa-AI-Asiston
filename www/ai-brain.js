// --- Elisa AI Online + Offline Self-Learning Brain ---

class ElisaAI {
    constructor() {
        this.knowledgeBase = [];
        this.maxMemorySize = 5000; // මතක තබා ගන්නා උපරිම වාක්‍ය ගණන (Storage එක ආරක්ෂා කිරීමට)
        this.loadBrain();
    }

    // Phone Storage එකෙන් පරණ මතකය Load කරගැනීම
    loadBrain() {
        const savedKnowledge = localStorage.getItem('elisa_knowledge');
        if (savedKnowledge) {
            this.knowledgeBase = JSON.parse(savedKnowledge);
            console.log(`🤖 Elisa: මතකය අවදි වුණා. දැනට මා සතුව දැනුම කරුණු ${this.knowledgeBase.length}ක් තියෙනවා.`);
        } else {
            // මුල්ම මූලික දැනුම
            this.knowledgeBase = [
                "hello", "hi", "hey",
                "oyage nama mokakda", "what is your name", "who are you", "kauda oya"
            ];
            this.saveBrain();
        }
    }

    // ඉගෙන ගන්නා දේවල් Phone එක ඇතුළේ සේව් කිරීම
    saveBrain() {
        if (this.knowledgeBase.length > this.maxMemorySize) {
            // පරණ මතකයන් අමතක කර අලුත් ඒවාට ඉඩ හැදීම (FIFO Rule)
            this.knowledgeBase = this.knowledgeBase.slice(this.knowledgeBase.length - this.maxMemorySize);
        }
        localStorage.setItem('elisa_knowledge', JSON.stringify(this.knowledgeBase));
    }

    // 100% ආරක්ෂිතව, අකුරු (Text) පමණක් අන්තර්ජාලයෙන් කියවා ඉගෙන ගැනීමේ ශ්‍රිතය (Online Learning)
    async learnFromInternet(topic) {
        console.log(`🤖 Elisa: මම අන්තර්ජාලයෙන් '${topic}' ගැන සොයනවා...`);
        
        // ආරක්ෂක නීතිය: අනවශ්‍ය හෝ හානිකර මාතෘකා වැළැක්වීම
        const bannedWords = ["hack", "bomb", "kill", "virus", "maranna", "hacker"];
        for (let word of bannedWords) {
            if (topic.toLowerCase().includes(word)) {
                return "🤖 Elisa: සමාවන්න, එම මාතෘකාව මගේ ආරක්ෂක නීති (Safety Rules) වලට පටහැනියි. මම ඒක ඉගෙන ගන්නේ නැහැ.";
            }
        }

        // නිදහස් සහ ආරක්ෂිත Wikipedia API එක භාවිතයෙන් තොරතුරු සෙවීම
        const url = `https://wikipedia.org{encode穩定 = encodeURIComponent(topic)}`;

        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'ElisaAI-App/1.0 (Contact: elisa@example.com)' }
            });

            if (!response.ok) {
                return `🤖 Elisa: මට අන්තර්ජාලයෙන් '${topic}' ගැන කරුණු සොයාගන්න බැරි වුණා. වෙනත් මාතෘකාවක් දෙන්න.`;
            }

            const data = await response.json();
            if (data.extract) {
                // විකිපීඩියා එකෙන් ලැබුණු ඡේදය වාක්‍ය වලට කැඩීම
                const sentences = data.extract.split(". ");
                let learnedCount = 0;

                for (let sentence of sentences) {
                    let cleanedSentence = sentence.trim();
                    if (cleanedSentence.length > 10 && !this.knowledgeBase.includes(cleanedSentence)) {
                        this.knowledgeBase.push(cleanedSentence);
                        learnedCount++;
                    }
                }

                if (learnedCount > 0) {
                    this.saveBrain();
                    return `🤖 Elisa (Online): මම '${topic}' ගැන අන්තර්ජාලයෙන් තනියම කියවලා අලුත් කරුණු ${learnedCount}ක් ඉගෙන ගත්තා! දැන් මට ඒ ගැන ඕනෑම දෙයක් අහන්න.`;
                } else {
                    return `🤖 Elisa: මම දැනටමත් '${topic}' ගැන සියලුම දේ දන්නවා යාලු.`;
                }
            } else {
                return `🤖 Elisa: සමාවන්න, '${topic}' ගැන පැහැදිලි විස්තරයක් අන්තර්ජාලයේ හමුවුණේ නැහැ.`;
            }
        } catch (error) {
            return "🤖 Elisa: මට අන්තර්ජාලයට සම්බන්ධ වීමට නොහැකි වුණා. කරුණාකර ඔබේ Internet (Wi-Fi/Data) පරීක්ෂා කරන්න.";
        }
    }

    // සරල අකුරු රටා සැසඳීමේ (Text Similarity) තර්කනය
    tokenize(text) {
        return text.toLowerCase().match(/\b\w+\b/g) || [];
    }

    calculateSimilarity(str1, str2) {
        const words1 = this.tokenize(str1);
        const words2 = this.tokenize(str2);
        const intersection = words1.filter(word => words2.includes(word));
        if (words1.length === 0 || words2.length === 0) return 0;
        return intersection.length / Math.sqrt(words1.length * words2.length);
    }

    // පණිවිඩයට පිළිතුරු දීම (Async Function එකක් ලෙස වෙනස් කර ඇත)
    async getResponse(userInput) {
        let cleanedInput = userInput.trim();

        // 1. අතින් උගන්වන ක්‍රමය -> teach: [කරුණ]
        if (cleanedInput.toLowerCase().startsWith("teach:")) {
            const factToLearn = cleanedInput.substring(6).trim();
            if (factToLearn.length > 3) {
                if (!this.knowledgeBase.includes(factToLearn)) {
                    this.knowledgeBase.push(factToLearn);
                    this.saveBrain();
                    return "🤖 මම ඒක සාර්ථකව ඉගෙන ගත්තා! මගේ මතකය යාවත්කාලීන වුණා.";
                }
                return "🤖 මම ඒක දැනටමත් දන්නවා යාලු.";
            }
            return "🤖 කරුණාකර පැහැදිලි වාක්‍යයක් ලබා දෙන්න.";
        }

        // 2. අන්තර්ජාලයෙන් ස්වයංක්‍රීයව ඉගෙනීමේ අණ -> learn [මාතෘකාව]
        if (cleanedInput.toLowerCase().startsWith("learn ")) {
            const topicToSearch = cleanedInput.substring(6).trim();
            return await this.learnFromInternet(topicToSearch);
        }

        // මූලික ක්ෂණික පිළිතුරු (Quick responses)
        let lowInput = cleanedInput.toLowerCase();
        if (lowInput === "hi" || lowInput === "hello" || lowInput === "hey") {
            return "Hello! I am Elisa, your private AI assistant. (සාදරයෙන් පිළිගනිමු!)";
        }
        if (lowInput.includes("name") || lowInput.includes("nama") || lowInput.includes("who are you") || lowInput.includes("kauda")) {
            return "මම ඔබේම පරිගණක කේතයෙන් උපන් Elisa AI සහායකයා වන්නෙමි. 😎";
        }

        // 3. තමන්ගේ මතකයෙන් (Offline Storage) පිළිතුරු සෙවීම
        let bestMatch = null;
        let highestScore = 0;

        for (const fact of this.knowledgeBase) {
            const score = this.calculateSimilarity(cleanedInput, fact);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = fact;
            }
        }

        if (highestScore > 0.3) {
            return bestMatch;
        } else {
            return "🤖 මම තවම ඒ ගැන දන්නේ නැහැ යාලු. මට ඒක අන්තර්ජාලයෙන් ඉගෙන ගන්න 'learn [මාතෘකාව]' කියලා (උදා: learn Science) අණ කරන්න.";
        }
    }
}

window.elisaBrain = new ElisaAI();
