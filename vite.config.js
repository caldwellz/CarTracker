import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const platformTargets = ['firefox120', 'edge88', 'safari14'];
let codeLen = 0;

export default defineConfig(({ command, mode, isPreview }) => {
    const devMode = mode !== 'production';
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
        envPrefix: ['API_', 'DOTENV_', 'VITE_'],
        build: {
            outDir: './dist',
            copyPublicDir: true,
            target: building ? platformTargets : 'esnext',
            minify: devMode ? false : 'esbuild',
            emptyOutDir: building,
            sourcemap: devMode,
            rollupOptions: {
                output: {
                    compact: !devMode,
                    manualChunks: (id, { getModuleInfo }) => {
                        const pathParts = id.split('/');
                        const modIndex = pathParts.indexOf('node_modules');
                        if (modIndex >= 0) {
                            codeLen += getModuleInfo(id).code?.length ?? 0;
                            return `vendor-${Math.trunc(codeLen / 1500000)}`;
                            // return pathParts[modIndex + 1].replace('@', '') + '-' + length;
                        }
                    },
                },
            },
        },
    };
});
