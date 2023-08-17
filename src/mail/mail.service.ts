import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber, SubcriberDocument } from 'src/subcribers/schemas/subcriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
@Injectable()
export class MailService {
    constructor (private readonly mailerService: MailerService,
        @InjectModel(Subcriber.name) private subcriberModel: SoftDeleteModel<SubcriberDocument>,
        @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>
        ){}
    async sendMail() {

        const subcribers = await this.subcriberModel.find({})
        for(const sub of subcribers){
            const skills = sub.skills
            const jobWithSkills = await this.jobModel.find({skills : {$in : skills}})
            if(jobWithSkills.length > 0){
                const jobs = jobWithSkills.map(job => {
                    return {
                        name: job.name,
                        company : job.company.name,
                        salary: `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
                        skills: job.skills
                    }
                })
                await this.mailerService.sendMail({
                    to: "quancuco27012004@gmail.com",
                    from: '"IT VIEC" <ITVIEC@gmail.com>', // override default from
                    subject: 'IT VIEC - New Jobs for Subcriber',
                    template : 'test',
                    context: {
                        receiver: sub.name,
                        jobs: jobs
                    }
                });
            }
        }
        
        
    }
}
