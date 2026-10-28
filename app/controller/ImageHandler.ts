import fs from "node:fs/promises";
import path from "node:path"
import sharp from "sharp"
import * as QueryString from "qs"
import {Image} from "../model/Image.ts";
import express from "express";
/*
[x] get list of pending images
show first one to user
allow them to tag it
move to sorted folder and rename to UUID from db
TODO: add source link to Image table in DB
 */
async function getUnsortedFileList(path:string= "./media/unsorted"):Promise<string[]>{
    // return await fs.readdir(folderPath);
    //TODO add functionality to the test form to get the list of files, update the preview image when the user selects one!
    return ["123"]
}

export async function tagImage(req:any,res:any){
    console.log(req.body)

    const fileName:string = req.body?.fileName;
    let unparsedTags:string = req.body?.tags;
    let splitTags = unparsedTags.split("#")
    const tags:string[] = [];
    for (const tag of splitTags) {
        if (tag !== ""){
            tags.push(tag.trim())
        }
    }
    console.log(tags)

    const sourceLink:string = req.body?.sauce;
    console.log(fileName)
    console.log(tags)
    console.log(sourceLink)
    let filetype = Image.parseExtension(fileName)
    let data = await Image.create(tags,filetype)
    await data.save()
    console.log(data);

    let newPath = await archiveImage(fileName,data._id)
    res.redirect(newPath)
}

async function archiveImage(fileName:string, id:string) {
    const source:string = "./media/unsorted/"
    const target:string = "./media/tagged/"
    let filetype = path.extname(fileName)
    if(filetype === ".gif"){
        try {
               await fs.rename(source+fileName,target+id+filetype)
            }catch (e){
                console.log(e)
            }
            return target+id+".gif"
    }else{
        await sharp(source+fileName)
            .toFormat('png') // Options: 'jpeg', 'png', 'webp', 'avif', 'tiff'
            .toFile(target+id+".png")
        await fs.unlink(source+fileName)
        return target+id+".png"
}
    return "if this gets returned we royally fucked up somewhere"
}

/*

const path = require('path');

const ext = path.extname('index.html');
console.log(ext); // ".html" (Note: includes the leading dot)

import fs from 'fs/promises';
// Or if using CommonJS: const fs = require('fs').promises;

async function moveAndRename() {
  const oldPath = './source_folder/old_name.txt';
  const newPath = './destination_folder/new_name.txt';

  try {
    await fs.rename(oldPath, newPath);
    console.log('File successfully moved and renamed!');
  } catch (error) {
    console.error('Error executing file operation:', error);
  }
}

moveAndRename();

 */
// export async function handleClientBooking(req:any, res:any) {
//     try {
//         const name = req.body?.name ? String(req.body.name).trim() : "";
//         const cpf = req.body?.cpf ? String(req.body.cpf).trim() : "";
//         const dateMs = Number(req.body?.dateMs);
//
//         if (!name || !cpf || isNaN(dateMs)) {
//             const msg = "Por favor, selecione um horário válido e preencha Nome e CPF.";
//             if (req.is("application/json") || req.headers.accept?.includes("application/json")) {
//                 return res.status(400).json({success: false, message: msg});
//             }
//             return res.redirect("/?error=" + encodeURIComponent(msg));
//         }
//
//         const result = await Appointment.bookAppointment(name, cpf, dateMs);
//
//         // If client used fetch expecting JSON (PDF Section 5)
//         if (req.is("application/json") || req.headers.accept?.includes("application/json")) {
//             return res.status(result.success ? 201 : 409).json(result);
//         }
//
//         // Standard <form> submission using Post/Redirect/Get pattern
//         if (result.success) {
//             return res.redirect("/?success=" + encodeURIComponent(result.message));
//         } else {
//             return res.redirect("/?error=" + encodeURIComponent(result.message));
//         }
//     } catch (err) {
//         console.error(err);
//         const msg = "Erro interno ao processar o agendamento.";
//         if (req.is("application/json") || req.headers.accept?.includes("application/json")) {
//             return res.status(500).json({success: false, message: msg});
//         }
//         return res.redirect("/?error=" + encodeURIComponent(msg));
//     }
// }