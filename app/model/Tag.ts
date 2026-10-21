// @ts-check
import {Connection} from "../controller/Connector.ts"


export class Tag {
    private _id: string;
    private name:string;

    constructor(name:string,_id:string="") {
        this.name = name;
        if(_id === ""){
            this._id = Tag.slugify(name)
        }else{
            this._id = _id
        }

    }

    async save() {
        try {
            await Connection.tags.updateOne(
                {_id:this._id},
                {$set:{name: this.name,
                _id: this._id}},
                {upsert:true});
        } catch (err) {
            console.log(err);
        }
    }


    static async getBySlug(slug:string){
        let tagData = await Connection.tags.findOne({_id: slug});

        if (tagData != null) {
            return new Tag(tagData.name,tagData._id);
        } else {
            return null;
        }
    }

    static async findOrCreate(name:string){
        let tagData = await Connection.tags.findOne({_id: Tag.slugify(name)});

        if (tagData != null) {
            return new Tag(tagData.name,tagData._id);
        } else {
            let temporaryTag = new Tag(name)
            await temporaryTag.save()
            return temporaryTag;
        }
    }

    static slugify(name:string){
        return name.toLowerCase().trim().replaceAll(" ", "_")
    }

    getName(){
        return this.name;
    }
    getSlug(){
        return this._id;
    }

}