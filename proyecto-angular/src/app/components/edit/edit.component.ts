import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { UploadService } from 'src/app/services/upload.service';
import { Global } from 'src/app/services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: '../create/create.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ProjectService, UploadService]
})
export class EditComponent implements OnInit {

  public title: string;
  public project!: Project;
  public save_project: any;
  public status: string | undefined;
  public filesToUpload!: Array<File>;
  public url: string;

  constructor(
    private _projectService: ProjectService,
    private _uploadServive: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = "Editar proyecto";
    this.url = Global.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.getProject(id)
    });
  }
  getProject(id: any){
    this._projectService.getProject(id).subscribe(
      response =>{
        this.project = response.project;
      },
      error =>{
        console.log(<any>error)
      }    
    )
  }
  onSubmit(project:any){
    this._projectService.updateProject(this.project).subscribe(
      response=>{
        console.log(response);
        if(response.project){
          //Subir imágen
          if(this.filesToUpload){
            this._uploadServive.makeFilesRequest(Global.url+"upload-image/" + response.project._id, [], this.filesToUpload,'image').then((result: any)=>{
              this.save_project = result.project;
              this.status = 'success';
            }); 
          }else{
            this.save_project = response.project;
            this.status = 'success';
          }
        }else{
          this.status = 'failed';
        }
      },
      error =>{
        console.log(<any>error)
      }
    )
  }
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
