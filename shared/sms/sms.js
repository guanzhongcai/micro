/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2018-12-04
 */
const SMSClient = require('@alicloud/sms-sdk');
const smsConfig = require('./smsConfig');

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换

/**
 * 发送短信
 * @param server 服务器名称 string
 * @param remark 消息说明 string
 */
exports.sendSMS = function(server, remark){

    console.log(`sendSMS ${server} ${remark}`);
    const tempParam = {server, remark};

    //初始化sms_client

    const option = {
        accessKeyId: smsConfig.accessKeyId,
        secretAccessKey: smsConfig.secretAccessKey
    };
    let smsClient = new SMSClient(option);

    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: smsConfig.PhoneNumbers, //必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
        SignName: smsConfig.SignName, //必填:短信签名-可在短信控制台中找到
        TemplateCode: smsConfig.TemplateCode, //必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
        // TemplateParam: '{"code":"12345"}' //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
        TemplateParam: JSON.stringify(tempParam) // 您有新的告警待处理，服务名称：${server}，报错摘要:${remark}，请及时处理。
    }).then(function (res) {
        let {Code} = res;
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
        }
    }, function (err) {
        console.error(err)
    })

};
