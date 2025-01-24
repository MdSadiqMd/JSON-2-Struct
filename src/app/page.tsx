"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function JsonToGoStructConverter() {
    const [jsonInput, setJsonInput] = useState("");
    const [goStruct, setGoStruct] = useState("");

    const convertJsonToGoStruct = () => {
        try {
            const jsonObj = JSON.parse(jsonInput);
            const structName = "MyStruct";
            const result = generateGoStruct(jsonObj, structName);
            setGoStruct(result);
        } catch (error) {
            setGoStruct("Error: Invalid JSON input");
        }
    };

    const generateGoStruct = (obj: any, structName: string): string => {
        let result = `type ${structName} struct {\n`;
        for (const [key, value] of Object.entries(obj)) {
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            const fieldType = getGoType(value);
            result += `\t${fieldName} ${fieldType} \`json:"${key}"\`\n`;
        }
        result += "}";
        return result;
    };

    const getGoType = (value: any): string => {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                return "[]" + getGoType(value[0]);
            }
            return "[]interface{}";
        }
        if (value === null) return "interface{}";
        switch (typeof value) {
            case "string":
                return "string";
            case "number":
                return Number.isInteger(value) ? "int" : "float64";
            case "boolean":
                return "bool";
            case "object":
                return (
                    "struct {\n" +
                    Object.entries(value)
                        .map(([k, v]) => {
                            const fieldName = k.charAt(0).toUpperCase() + k.slice(1);
                            return `\t\t${fieldName} ${getGoType(v)} \`json:"${k}"\``;
                        })
                        .join("\n") +
                    "\n\t}"
                );
            default:
                return "interface{}";
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">JSON to Go Struct Converter</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-2">
                        JSON Input
                    </label>
                    <Textarea
                        id="jsonInput"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your JSON here"
                        className="h-[400px]"
                    />
                </div>
                <div>
                    <label htmlFor="goStruct" className="block text-sm font-medium text-gray-700 mb-2">
                        Go Struct Output
                    </label>
                    <Textarea id="goStruct" value={goStruct} readOnly className="h-[400px]" />
                </div>
            </div>
            <Button onClick={convertJsonToGoStruct} className="mt-4">
                Convert to Go Struct
            </Button>
        </div>
    );
}
