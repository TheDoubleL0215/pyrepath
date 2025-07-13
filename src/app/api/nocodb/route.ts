import { NextRequest, NextResponse } from 'next/server';

// NocoDB konfiguráció
const NOCODB_URL = process.env.NOCODB_URL || 'https://your-nocodb-instance.com';
const NOCODB_API_KEY = process.env.NOCODB_API_KEY || '';
const TABLE_NAME = process.env.NOCODB_TABLE_NAME || 'leads';

// Helper függvény a NocoDB API hívásokhoz
async function nocodbRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${NOCODB_URL}/api/v2/tables/${TABLE_NAME}/records${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'xc-token': NOCODB_API_KEY,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`NocoDB API hiba: ${response.status} ${response.statusText}`);
  }
  return response.json();

}

// GET - összes rekord lekérése
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '25';
    const offset = searchParams.get('offset') || '0';
    const where = searchParams.get('where');
    const sort = searchParams.get('sort');

    let endpoint = `?limit=${limit}&offset=${offset}`;
    if (where) endpoint += `&where=${where}`;
    if (sort) endpoint += `&sort=${sort}`;

    const data = await nocodbRequest(endpoint);

    return NextResponse.json({
      success: true,
      data: data.list || data,
      total: data.pageInfo?.totalRows || data.length,
    });
  } catch (error) {
    console.error('NocoDB GET hiba:', error);
    return NextResponse.json(
      { success: false, error: 'Sikertelen adatok lekérése' },
      { status: 500 }
    );
  }
}

// POST - új rekord létrehozása
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await nocodbRequest('', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('NocoDB POST hiba:', error);
    return NextResponse.json(
      { success: false, error: 'Sikertelen rekord létrehozása' },
      { status: 500 }
    );
  }
}

// PUT - rekord frissítése
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('id');

    if (!recordId) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó rekord ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const url = `${NOCODB_URL}/api/v2/tables/${TABLE_NAME}/records/`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': NOCODB_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PATCH hiba: ${response.statusText}`);
    }

    const data = await response.json();


    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('NocoDB PUT hiba:', error);
    return NextResponse.json(
      { success: false, error: 'Sikertelen rekord frissítése' },
      { status: 500 }
    );
  }
}


// DELETE - rekord törlése
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('id');

    if (!recordId) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó rekord ID' },
        { status: 400 }
      );
    }

    await nocodbRequest(`/${recordId}`, {
      method: 'DELETE',
    });

    return NextResponse.json({
      success: true,
      message: 'Rekord sikeresen törölve',
    });
  } catch (error) {
    console.error('NocoDB DELETE hiba:', error);
    return NextResponse.json(
      { success: false, error: 'Sikertelen rekord törlése' },
      { status: 500 }
    );
  }
}

