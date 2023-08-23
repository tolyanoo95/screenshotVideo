import { NextResponse } from 'next/server'
import fs from 'fs-extra';
import path from 'path';

export async function POST(req: Request) {
  const {dataURL} = await req.json()
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
  
  try {
    const nameImage = new Date().getTime();
    const outputPath = path.join(process.cwd(), 'public/saved-images', nameImage + '.png');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, base64Data, 'base64');
    return NextResponse.json({ pathImage: `/saved-images/${nameImage}.png`, timeCreate: nameImage, base64Data: dataURL });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save image.' });
  }
  
}