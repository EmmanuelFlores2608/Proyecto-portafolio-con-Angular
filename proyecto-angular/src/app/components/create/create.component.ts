import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { UploadService } from 'src/app/services/upload.service';
import { Global } from 'src/app/services/global';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [ProjectService, UploadService]
})
export class CreateComponent implements OnInit {

  public title: string;
  public project: Project;
  public save_project: any;
  public status: string | undefined;
  public filesToUpload!: Array<File>;
  public url: string;

  constructor(
    private _projectService: ProjectService,
    private _uploadServive: UploadService
  ) {
    this.title = "Crear proyecto";
    this.project = new Project('', '', '', '', 2019, '', '');
    this.url = Global.url;
  }

  ngOnInit(): void {
  }
  onSubmit(form: any){
    //Guardar los datos básicos
    console.log(this.project);
    this._projectService.saveProject(this.project).subscribe(
      response=>{
        console.log(response);
        if(response.project){
          //Subir imágen
          if(this.filesToUpload){
            this._uploadServive.makeFilesRequest(Global.url+"upload-image/" + response.project._id, [], this.filesToUpload,'image').then((result: any)=>{
              this.save_project = result.project;
              this.status = 'success';
              form.reset();
            });
          }else{
            this.save_project = response.project;
            this.status = 'success';
            form.reset();
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
