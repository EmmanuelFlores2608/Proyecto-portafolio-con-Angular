'use strict'

const { findByIdAndUpdate } = require('../models/project');
const project = require('../models/project');
var Project = require('../models/project')
var fs = require('fs');
var path = require('path');

var controller = {
    home: function(req, res){
        return res.status(200).send({
            message: 'Soy home'
        });
    },
    test: function(req, res){
        return res.status(200).send({
            message: 'Soy test'
        });
    },

    saveProject: function(req, res){
        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored) =>{
            if(err) return res.status(500).send({
                menssage: 'Error al guardar el documento'
            });
            if(!projectStored) return res.status(404).send({
                menssage: 'No se ha podido guardar el proyecto'
            });

            return res.status(200).send({project: projectStored});
        });
    },
    getProject: function(req, res){
        var projectID = req.params.id;
        if (projectID == null){
            return res.status(404).send({
                menssage: 'El proyecto no existe'
            });
        }
        Project.findById(projectID, (err, project) =>{
            if(err) return res.status(500).send({
                menssage: 'Error al devolver los datos'
            });
            if(!project) return res.status(404).send({
                menssage: 'El proyecto no existe'
            });

            return res.status(200).send({project});
        });
    },
    getProjects: function(req, res){
        Project.find({}).sort('-year').exec((err, projects)=>{
            if(err) return res.status(500).send({
                menssage: 'Error al devolver los datos'
            });
            if(!projects) return res.status(404).send({
                menssage: 'No hay proyectos para mostrar'
            });

            return res.status(200).send({projects});
        });
    },
    updateProject: function(req, res){
        var projectID = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectID, update, {new:true},(err, projectUpdated) =>{
            if(err) return res.status(500).send({
                menssage: 'Error al actualizar los datos'
            });
            if(!projectUpdated) return res.status(404).send({
                menssage: 'No existe el proyecto que desea actualizar'
            });

            return res.status(200).send({project: projectUpdated});
        });  
    },
    deleteProject: function(req, res){
        var projectID = req.params.id;
        Project.findByIdAndRemove(projectID, (err, projectDelete)=>{
            if(err) return res.status(500).send({
                menssage: 'No se ha podido borrar el proyecto'
            });
            if(!projectDelete) return res.status(404).send({
                menssage: 'No existe el proyecto que desea eliminar'
            });

            return res.status(200).send({project: projectDelete});
        });
    },
    uploadImage: function(req, res){
        var projectID = req.params.id;
        var fileName = 'Imagen no subida'

        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\')
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.')
            var fileExt = extSplit[1];

            if(fileExt == 'jpg' || fileExt == 'png' || fileExt == 'jpeg' || fileExt == 'gif' ){
                Project.findByIdAndUpdate(projectID, {image: fileName}, { new:true },(err, projectUpdated) =>{
                    if(err) return res.status(200).send({
                        menssage: 'No se ha podido subir la imagen'
                    });
                    if(!projectUpdated) return res.status(404).send({
                        menssage: 'EL proyecto no existe'
                    });
                    return res.status(200).send({
                        project: projectUpdated
                     });
                });
            }else{
                fs.unlink(filePath, (err) =>{
                    return res.status(200).send({
                        message: 'La extención no es válida'
                    });
                });
            }
        }else{
            return res.status(200).send({
                message: fileName
            });
        }
    },
    getImageFile: function(req, res){
        var file = req.params.image;
        var path_file = './uploads/'+file;
        fs.exists(path_file, (exist) =>{
            if(exist){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({
                    message: "No existe la imagen"
                })
            }
            
        });
    }
};

module.exports = controller;