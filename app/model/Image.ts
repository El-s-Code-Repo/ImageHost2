// @ts-check
import {Connection} from "../controller/Connector.ts"

export class Image {
    private _id: string;
    // private fileName: string; filename == uuid
    private tags:string[];
    constructor(tags:string[],_id:string = "") {


        this.tags = Array.from(tags); //TODO update to use new tag model!
        this._id = _id;
    }



    async save() {
        try {
            if (this._id === ""){
                let data = await Connection.images.insertOne({
                    tags:this.tags,
                    });
                this._id = data.insertedId.toString();

            }else{
                let data = await Connection.images.updateOne(
                    {_id: this._id},
                    {$set: {tags: this.tags}},
                    {upsert: true}
                );
                if (data.upsertedId != null) {
                    this._id = data.upsertedId.toString();
                }
            }
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