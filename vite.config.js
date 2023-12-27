import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const platformTargets = ['firefox120', 'edge88', 'safari14'];

export default defineConfig(({ command, mode, isPreview }) => {
    const developmentMode = mode !== 'production';
    const building = command !== 'serve' && !isPreview;
    return {
        root: './frontend',
        publicDir: './public',
        envDir: '..',
        plugins: [react()],
        appType: 'spa',
        server: {
            open: false,
            port: 8080,
            strictPort: false,
        },
        envPrefix: ['DOTENV_', 'VITE_'],
        build: {
            outDir: './dist',
            copyPublicDir: true,
            target: building ? platformTargets : 'esnext',
            minify: developmentMode ? false : 'esbuild',
            emptyOutDir: building,
            sourcemap: developmentMode,
        },
    };
});
