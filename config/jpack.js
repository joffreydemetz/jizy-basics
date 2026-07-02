import fs from 'fs';
import path from 'path';
import { jPackConfig } from 'jizy-packer';

const jPackData = function () {
    jPackConfig.sets({
        name: 'jBasics',
        alias: 'jizy-basics'
    });

    jPackConfig.set('onCheckConfig', () => { });
    jPackConfig.set('onGenerateBuildJs', (code) => code);
    jPackConfig.set('onGenerateWrappedJs', (wrapped) => wrapped);

    // jizy-basics is a CSS aggregator, not a named module — strip the packer's
    // /*! jBasics … */ banner so the dist starts at /*! normalize.css … */. The
    // normalize.css + basics.css section banners are self-identifying, and this
    // keeps the jizy-front.css bundle clean (bundle banner → normalize → basics
    // → modules, no stray package banner). The packer has already moved the CSS
    // into dist/css/ by the time this hook runs (jizy-packer/lib/Rollup.js).
    jPackConfig.set('onPacked', () => {
        const css = path.join(jPackConfig.get('targetPath'), 'css', jPackConfig.get('alias') + '.min.css');
        if (fs.existsSync(css)) {
            fs.writeFileSync(css, fs.readFileSync(css, 'utf8').replace(/^\/\*! jBasics[^\n]*\*\/\s*\n?/, ''));
        }
    });
};

export default jPackData;
