import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY',
    region: 'us-east-1' // or your bucket region
})

const s3 = new AWS.S3()
export default s3
