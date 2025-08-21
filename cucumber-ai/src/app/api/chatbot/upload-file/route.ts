import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  return new Promise<NextResponse>(async (resolve) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return resolve(NextResponse.json({ error: 'No file provided' }, { status: 400 }));
      }

      const tempDir = 'C:/temp';
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const inputPath = path.join(tempDir, `${timestamp}-${file.name}`);
      const outputPath = inputPath.replace(/\.(xlsx|xls)$/i, '.pdf');

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(inputPath, buffer);

      const libreOfficePath = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`;
      await execAsync(`${libreOfficePath} --headless --convert-to pdf:calc_pdf_Export:{\\"SinglePageSheets\\":true} "${inputPath}" --outdir "${tempDir}"`);

      const pdfBuffer = fs.readFileSync(outputPath);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      return resolve(
        new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=converted.pdf',
          },
        })
      );
    } catch (error) {
      console.error('Conversion failed:', error);
      return resolve(
        NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
      );
    }
  });
}
