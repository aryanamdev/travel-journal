import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URL || "", {
        })

        const connection = mongoose.connection
        connection.on("connected", () => {
            console.log("Mongodb connected sucessfully")
        })

        connection.on("error", () => {
            console.log("Please make sure mongodb is running")
            process.exit(1)
        })


    } catch(error){
        console.error(`Something went wrong while connecting to the database, error: ${error}`)
    }
}


connect()