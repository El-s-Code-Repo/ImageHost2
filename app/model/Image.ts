// @ts-check
import {Connection} from "../controller/Connector.ts"
import {Tag} from "./Tag.ts";
import {UUID} from "mongodb";
import path from "node:path";
import fs from "node:fs/promises";

export class Image {
    _id: string;
    extension:string
    private tags:Tag[];
    /*
    * Do not use constructor directly, call Image.create() instead
    * */
    constructor(tags:Tag[],filetype:string,_id:string = "") {
        this.tags = Array.from(tags);
        this.extension = filetype
        this._id = _id;
    }

    static async create(tags:string[],filetype:string,_id:string=""):Promise<Image>{
        let tagList:Tag[] = []

        for (const tagName of tags) {
            let temporaryTag:Tag = await Tag.findOrCreate(tagName)
            tagList.push(temporaryTag)
        }

        if(_id === ""){
            return new Image(tagList,filetype)
        }else{
            return new Image(tagList,filetype,_id)
        }
    }

    static async get(id:UUID){
        let lookupResult = await Connection.images.findOne({_id:id});
        return Image.create(lookupResult.tags,lookupResult.extension,lookupResult._id);
    }

    async save() {
        let tagSlugs:string[] = this.getTagSlugs()

        try {
            if (this._id === ""){
                let data = await Connection.images.insertOne({
                    tags:tagSlugs,
                    extension:this.extension
                    });
                this._id = data.insertedId.toString();

            }else{
                let data = await Connection.images.updateOne(
                    {_id: this._id},
                    {$set: {tags: tagSlugs, extension:this.extension}},
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


    static parseExtension(fileName:string){
        let filetype = path.extname(fileName)
        if (filetype === ".gif"){
            return ".gif"
        }
        return ".png"
    }

    static async getUnsortedFileList(path:string= "./media/unsorted"):Promise<string[]>{
        const FOLDERPATH:string = "./media/unsorted"
        return await fs.readdir(FOLDERPATH);
        //TODO add functionality to the test form to get the list of files, update the preview image when the user selects one!
    }

}