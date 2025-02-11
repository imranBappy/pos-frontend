import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";


export async function uploadImageToS3(file: File) {

    const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_BUCKET_REGION as string,
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_BUCKET_ACCESS_KEY as string,
            secretAccessKey: process.env.NEXT_PUBLIC_BUCKET_SECRET_ACCESS_KEY as string,
        },
    });

    const params = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME as string,
        Key: `${Date.now()}-${file.name}`,
        Body: file,
    };

    const command = new PutObjectCommand(params);
    try {
        await s3Client.send(command);
        return `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_BUCKET_REGION}.amazonaws.com/${params.Key}`;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload image to S3');
    }
}

export async function deleteImageFromS3(url: string) {
    if (!url) throw new Error('No URL provided');
    try {
        const s3Client = new S3Client({
            region: process.env.NEXT_PUBLIC_BUCKET_REGION as string,
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_BUCKET_ACCESS_KEY as string,
                secretAccessKey: process.env.NEXT_PUBLIC_BUCKET_SECRET_ACCESS_KEY as string,
            },
        });

        const key = url.split('/').pop();
        const params = {
            Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME as string,
            Key: key,
        };
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error('Error deleting from S3:', error);
        throw new Error('Failed to delete image from S3');
    }
}

export async function uploadImagesToS3(files: File[]) {
    if (!files || files.length === 0) throw new Error('No files provided');
    const urls = await Promise.all(files.map(uploadImageToS3));
    return urls;
}



export default uploadImageToS3;


