---
title: ❌ 疑难代码写法记录
summary: 遇到的一些令人疑惑的问题及其代码实现
date: 2025-08-05
authors:
  - admin
tags:
  - other
image:
  filename: "Image_1752969387894.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---

```java
    // 需要反序列化如下类
    static class MqMessage<T> {
        String topic;
        T message;

        public T getMessage() {
            return message;
        }

        public void setMessage(T message) {
            this.message = message;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        @Override
        public String toString() {
            return "MqMessage{" +
                    "topic='" + topic + '\'' +
                    ", message=" + message +
                    '}';
        }
    }

    static class TestData {
        String dataTopic;
        String dataMessage;

        public String getDataTopic() {
            return dataTopic;
        }

        public void setDataTopic(String dataTopic) {
            this.dataTopic = dataTopic;
        }

        public String getDataMessage() {
            return dataMessage;
        }

        public void setDataMessage(String dataMessage) {
            this.dataMessage = dataMessage;
        }

        @Override
        public String toString() {
            return "Data{" +
                    "dataTopic='" + dataTopic + '\'' +
                    ", dataMessage='" + dataMessage + '\'' +
                    '}';
        }
    }

    @Test
    public void testParse() {
        String jsonStr = "{\"topic\":\"topic\",\"message\":{\"dataTopic\":\"dataTopic\",\"dataMessage\":\"dataMessage\"}}";
        MqMessage<TestData> mqMessage = testParse(jsonStr,TestData.class);
        System.out.println(mqMessage.getMessage().getClass().getName());
    }


    private <T> MqMessage<T> testParse(String jsonStr,Class<T> clazz) {
        return JSON.parseObject(jsonStr, new TypeReference<MqMessage<T>>(clazz) {
        });
    }
```