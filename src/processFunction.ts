import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});
const dynamoDBClient = new DynamoDBClient({})

export async function handler(event: any) {
    const tableName = process.env.TABLE_NAME;
    const topicArn = process.env.TOPIC_ARN;
    console.log(event);
    
    const body = JSON.parse(event.body);
    console.log(body);

    if(!body.text){
        console.log('Invalid JSON structure, adding to DynamoDB')
        //invalid JSON
        const ttl: number = Math.floor(Date.now() / 1000 + 180);

        await dynamoDBClient.send(new PutItemCommand(
            {
                TableName: tableName,
                Item: { 
                    id:{S: Math.random().toString()},
                    errorMassage: {S: 'Invalid JSON structure '},
                    ttl: {N: ttl.toString()}

            }
        }
        ));
    } 
        else{
            //Publiosh to SNS
            await snsClient.send(new PublishCommand({
                TopicArn: topicArn,
                Message: `Poluchen e validen JSON:${body.text}`

            }

            ));
            console.log('Notification sent')


        }


    return {
        statusCode: 200,
        body: 'Privet Lambda'
    };
}
    