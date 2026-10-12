import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {MistralAIEmbeddings} from "@langchain/mistralai"
import dotenv from "dotenv"
import {Pinecone} from "@pinecone-database/pinecone";
dotenv.config()


const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
})

const index = pc.index("cohort-2-rag")


// const loader = new PDFLoader('./story.pdf')


// const docs = await loader.load()

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed"
});





// const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap: 0
// })

// const chunks = await splitter.splitDocuments(docs)

// const texts = chunks.map((chunk) => chunk.pageContent);
// const vectors = await embeddings.embedDocuments(texts);

// await index.deleteAll();

// const results = await index.upsert({
//     records:chunks.map((chunk , i) => ({
//         id: `chunk-${i}`,
//         values: vectors[i],
//         metadata: { text: chunk.pageContent }
//     }))
// })

// const stats = await index.describeIndexStats();
// console.log(stats);



const queryEmbedding = await embeddings.embedQuery("how was the internship");
console.log(queryEmbedding);

const results = await index.query({
    topK: 2,
    vector: queryEmbedding,
    includeMetadata: true,
})

console.log(JSON.stringify(results,null,2))