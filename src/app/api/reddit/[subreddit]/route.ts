import { NextRequest, NextResponse } from 'next/server';

const REDDIT_BASE_URL = 'https://www.reddit.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subreddit: string }> }
) {
  const { subreddit } = await params;
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'hot';
  const timeFilter = searchParams.get('t') || 'week';
  const limit = searchParams.get('limit') || '100';
  const after = searchParams.get('after');

  const paramsObj = new URLSearchParams({
    limit,
    raw_json: '1',
  });

  if (after) paramsObj.set('after', after);
  if (sort === 'top') paramsObj.set('t', timeFilter);

  const url = `${REDDIT_BASE_URL}/r/${subreddit}/${sort}.json?${paramsObj}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ReddiTunes/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from r/${subreddit}: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Reddit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}