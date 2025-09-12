import React from 'react';

// Using a base64 encoded image to avoid hosting issues.
// This is the logo for Kendriya Vidyalaya Sangathan from the user's template.
const kvLogoBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKRSURBVHhe7ZxBaxNRFIb/nYQggoKK4EFQ8CLYQ9BTEHsp/g/yG7T0PAg+iHj1JIKgJ6HiwaOgIAheRDAoKIoHwYOoDyZpZ1J2Z86bHfgjeCbZ2Zn3d86b97IJCQkJCQkJCQkJCQkJCfnPJDBv3iK8fP2G3w4f0t/Jk3Q3c4a222/Qu2OHdDpzlvY3btD+xAnKnjhB+T9OUL4/T1B+NU9QPjVB+Qkkyu+Mkn9bkvzXkvzflCS/lST/9yT5/y3J//kkyS+Mkr/7S/L7iSRvj5C83UMy/z5C888HNN85oPntAU3fL2j654Om/3tA89E+mm/t0Xz+As0vbtC8dY/mg9s0792jefsBzXsPaN7/QPP1A5o/naD5xROa/2hA8z8OaP51hvZPDmj+do72z/do//Q87Z89SPvnD2n/9g7tX17S/tUd2h/eov3hLdpf36P9l3e0f39P+39c0f5/jmj/cET7D6doPzhF+yenaX86S/tHT2l/9gjtnz6k/dOHtH9+mvbP79D+2Wna3z5L++9naX//Lu2fX6b92xfYv3+B/fMX2L9/g/0HF9i/v8H+w3fYv3+L/Qc32L99i/0Ht9g/u8X+g9vs391i/+Ht9s/u4f71/e6/fRj3z5/g/vED3D+/h/vXJ7j/eJj7z2e4//Qg95/PcH/1EO5fnuL+1X3cvz3M/esT3L8/xf3bY9y/PcS9u8f92+O4fz/B/fsj3L89wv2bY9w/PsL9m2Pc//MI9y+Pcf/uKPdffuD+1QD3b49w//wA96/fcv/2GPe/fsv92+Pc/wEkJCQkJCQkJCQkJCQkXl7+A7y/3n0qgX2EAAAAAElFTkSuQmCC`;

export const KvLogo = () => (
  <div className="w-20 h-20 flex items-center justify-center">
    <img src={kvLogoBase64} alt="Kendriya Vidyalaya Sangathan Logo" className="w-auto h-auto object-contain" />
  </div>
);


export const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const BrandIcon = () => (
    <img src={kvLogoBase64} alt="Kendriya Vidyalaya Sangathan Logo" className="w-8 h-8 object-contain" />
);