// Source - https://stackoverflow.com/a/49400334
// Posted by Matt, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-23, License - CC BY-SA 4.0
import {MongoClient, UUID,Collection} from "mongodb";


export class Connection {

    static images:Collection<any>;
    static tags:Collection<any>;
    //
    // /** @type {import("mongodb").Collection<any>} */
    // static timetable:import("mongodb").Collection<any>;
    static db:any;
    static mongoclient:any;

    static url:string

    static async open() {
        if (this.mongoclient) return this.db;
        // this.mongoclient = await MongoClient.connect(this.url);
        this.mongoclient = await MongoClient.connect("mongodb://localhost:27017", {
            pkFactory: {
                createPk: () => new UUID()
            }
        });
        this.db = await this.mongoclient.db("ImageHost");
        this.images = await this.db.collection('images');
        this.tags= await this.db.collection('tags');
        // this.timetable = await this.db.collection('timetable');
        return this.db;
    }

}

Connection.mongoclient = null;
Connection.db = null;
Connection.url = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/';