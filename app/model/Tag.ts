// @ts-check
import {Connection} from "../controller/Connector.ts"
import {UUID} from "mongodb";

export class Tag {
    private _id: string;
    private name:string;

    constructor(name:string) {
        this.name = name;
        this._id = name.toLowerCase().trim().replaceAll(" ", "_")
    }



    async save() {
        try {
            let data = await Connection.tags.insertOne({
                tags: this.tags,
            });

            }
            // }else{
            //     let data = await Connection.images.updateOne(
            //         {_id: this._id},
            //         {$set: {tags: this.tags}},
            //         {upsert: true}
            //     );
            //     if (data.upsertedId != null) {
            //         this._id = data.upsertedId.toString();
            //     }
            // }
        } catch (err) {
            console.log(err);
        }
    }
    //
    // /**
    //  * @param {String|Number} cpf
    //  * @param {String} name
    //  * @returns {Promise<Client>}
    //  */
    // static async get(name:Number, cpf) {
    //     let testClient = await Client.getClientByCPF(cpf);
    //
    //     if (testClient != null) {
    //         return new Client(testClient.name, testClient.cpf, testClient._id);
    //     } else {
    //         return new Client(name, cpf);
    //     }
    // }
    //
    // /**
    //  * @param {Number} id
    //  */
    // static async getImageById(id:number) {
    //     const normalizedCpf = String(cpf).trim();
    //     let clientData = await Connection.clients.findOne({cpf: normalizedCpf});
    //     if (clientData != null) {
    //         return new Client(clientData.name, clientData.cpf, clientData._id);
    //     } else {
    //         return null;
    //     }
    // }
}