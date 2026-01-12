---
title: 🦚 java调用js
description: java软件中嵌入js代码块
date: 2025-08-05
authors:
  - admin
tags:
  - java与其他语言交互
image:
  filename: "Image_1752969385133.jpg"
  focal_point: Smart
  preview_only: false
  alt_text: "随机图片"
---
## 简介
java调用js文件实现方式

### jdk中原生支持
```java
import javax.script.*;
import java.util.ArrayList;
import java.util.List;

public class JsCallJava {
    public static void main(String[] args) throws Exception {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");

        // 注入 Java 对象
        engine.put("table", new Table());
        engine.put("factory", new StudentFactory());
        Bindings bindings = engine.getBindings(ScriptContext.ENGINE_SCOPE);
        Compilable compilable = (Compilable) engine;

        // JS 脚本中调用 Java 对象的方法

        CompiledScript script = compilable.compile("var students = factory.createStudent();" +
                "print(students.getClass());" +
                "table.printStudents(students);");
        script.eval(bindings);
    }


    public static class StudentFactory {
        public List<Student> createStudent() {
            List<Student> students = new ArrayList<>();
            for (int i = 0; i < 10; i++) {
                Student student = new Student();
                student.setName("<UNK>");
                student.setAge(i);
                students.add(student);
            }
            return students;
        }
    }

    public static class Student {
        String name;
        int age;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        @Override
        public String toString() {
            return "Student{" +
                    "name='" + name + '\'' +
                    ", age=" + age +
                    '}';
        }
    }

    public static class Table {
        public void printStudents(List<Student> students) {
            System.out.println(students);
        }
    }
}
```