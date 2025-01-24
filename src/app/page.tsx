'use client';
import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonValue[];

interface JsonObject {
    [key: string]: JsonValue;
}

export default function JsonToGoStructConverter() {
    const [jsonInput, setJsonInput] = useState('');
    const [goStruct, setGoStruct] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        Prism.highlightAll();
    }, [goStruct]);

    const convertJsonToGoStruct = () => {
        try {
            const jsonObj = JSON.parse(jsonInput);
            const structName = 'MyStruct';
            const result = generateGoStruct(jsonObj, structName);
            setGoStruct(result);
        } catch (parseError) {
            setGoStruct('Error: Invalid JSON input');
            console.log('Error parsing JSON:', parseError);
        }
    };

    const generateGoStruct = (obj: JsonObject, structName: string): string => {
        let result = `type ${structName} struct {\n`;
        for (const [key, value] of Object.entries(obj)) {
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            const fieldType = getGoType(value);
            result += `\t${fieldName} ${fieldType} \`json:"${key}"\`\n`;
        }
        result += '}';
        return result;
    };

    const getGoType = (value: JsonValue): string => {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                return '[]' + getGoType(value[0]);
            }
            return '[]interface{}';
        }
        if (value === null) return 'interface{}';
        switch (typeof value) {
            case 'string':
                return 'string';
            case 'number':
                return Number.isInteger(value) ? 'int' : 'float64';
            case 'boolean':
                return 'bool';
            case 'object':
                return 'struct {\n' + Object.entries(value).map(([k, v]) => {
                    const fieldName = k.charAt(0).toUpperCase() + k.slice(1);
                    return `\t\t${fieldName} ${getGoType(v)} \`json:"${k}"\``;
                }).join('\n') + '\n\t}';
            default:
                return 'interface{}';
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(goStruct);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (copyError) {
            console.error("Failed to copy text: ", copyError);
        }
    };

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">JSON to Go Struct Converter</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="transition-all duration-300 ease-in-out transform hover:scale-102">
                    <label htmlFor="jsonInput" className="block text-sm font-medium mb-2">
                        JSON Input
                    </label>
                    <Textarea
                        id="jsonInput"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your JSON here"
                        className="h-[400px] bg-gray-800 text-gray-100 font-mono"
                    />
                </div>
                <div className="transition-all duration-300 ease-in-out transform hover:scale-102 relative">
                    <label htmlFor="goStruct" className="block text-sm font-medium mb-2">
                        Go Struct Output
                    </label>
                    <pre className="h-[400px] overflow-auto bg-gray-800 rounded-md p-4">
                        <code className="language-go">{goStruct}</code>
                    </pre>
                    {goStruct && (
                        <button
                            onClick={copyToClipboard}
                            className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-300"
                            title="Copy to clipboard"
                        >
                            {copied ?
                                <Check size={20} className="text-green-500" />
                                : <Copy size={20} className="text-gray-300" />
                            }
                        </button>
                    )}
                </div>
            </div>
            <Button
                onClick={convertJsonToGoStruct}
                className="mt-6 px-2 md:w-auto bg-blue-600 hover:bg-blue-700 transition-colors duration-300 md:text-sm"
            >
                Convert to Go Struct
            </Button>
            <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm text-gray-300 py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 hover:bg-opacity-100">
                    <a
                        href="https://x.com/Md_Sadiq_Md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                        title="Follow @Md_Sadiq_Md on X"
                    >
                        <span className="text-sm font-medium">Built by @Md_Sadiq_Md</span>
                    </a>
                </div>
            </footer>
        </div>
    );
}
