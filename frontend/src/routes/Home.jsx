import { Button } from '@mui/material';
import { useState } from 'react';

export default function Home() {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1>Vite + React</h1>
            <div className="card">
                <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
        </>
    );
}
