import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});
const dynamoDBClient = new DynamoDBClient({});


export async function handler(event: any) {
    const tableName = process.env.TABLE_NAME;
    const topicArn = process.env.TOPIC_ARN;
    console.log(event);
    console.log(event.Records[0].dynamodb);

    await snsClient.send(new PublishCommand({
        TopicArn: topicArn,
        Message: `Iztrit e elemnet ot tablicata ${tableName}` 

    }
));

    return {
        statusCode: 200,
        body: 'Privet Lambda cleanup'
    };
}
    