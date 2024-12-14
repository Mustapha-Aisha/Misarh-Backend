import { Job } from 'bull';
export declare class SendEmailConsumer {
    private readonly logger;
    constructor();
    transcode(job: Job<unknown>): Promise<void>;
}
