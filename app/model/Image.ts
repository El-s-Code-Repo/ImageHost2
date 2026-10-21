// @ts-check
import {Connection} from "../controller/Connector.ts"
import {Tag} from "./Tag.ts";
import {UUID} from "mongodb";

export class Image {
    _id: string;

    private tags:Tag[];
    /*
    * Do not use constructor directly, call Image.create() instead
    * */
    constructor(tags:Tag[],_id:string = "") {
        this.tags = Array.from(tags); //TODO update to use new tag model!
        this._id = _id;
    }

    static async create(tags:string[],_id:string=""):Promise<Image>{
        let tagList:Tag[] = []

        for (const tagName of tags) {
            let temporaryTag:Tag = await Tag.findOrCreate(tagName)
            tagList.push(temporaryTag)
        }

        if(_id === ""){
            return new Image(tagList)
        }else{
            return new Image(tagList,_id)
        }
    }

    static async get(id:UUID){
        let lookupResult = await Connection.images.findOne({_id:id});
        return Image.create(lookupResult.tags,lookupResult._id);
    }

    async save() {
        let tagSlugs:string[] = this.getTagSlugs()

        try {
            if (this._id === ""){
                let data = await Connection.images.insertOne({
                    tags:tagSlugs,
                    });
                this._id = data.insertedId.toString();

            }else{
                let data = await Connection.images.updateOne(
                    {_id: this._id},
                    {$set: {tags: tagSlugs}},
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

    getTagNames():string[]{
        let tagList:string[] = []
        for (const tag of this.tags) {
            tagList.push(tag.getName())
        }
        return tagList
    }

    getTagSlugs():string[]{
        let tagList:string[] = []
        for (const tag of this.tags) {
            tagList.push(tag.getSlug())
        }
        return tagList
    }

}