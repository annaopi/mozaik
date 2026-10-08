import "dotenv/config"
import MemoryClient from "mem0ai"

const client = new MemoryClient(
    { 
        apiKey: process.env.MEM0_API_KEY
    });

async function main() {

	const userId = `test-user-${Date.now()}`

	console.log("User:", userId)

	await client.add(
		[
			{
				role: "user",
				content: "I am a traveler and I am looking for flight information.",
			},
			{
				role: "assistant",
				content: "Where do you want to go?",
			},
			{
				role: "user",
				content: "I want to go to Los Angeles.",
			},
		],
		{
			userId,
		}
	)

	const result = await client.search(
		"Where does the user want to go?",
		{
			filters: {
				user_id: userId,
			},
		}
	)

	console.log("\nMem0 result:")
	console.dir(result, { depth: null })
}

main()