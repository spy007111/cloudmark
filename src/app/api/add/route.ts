import { type NextRequest, NextResponse } from "next/server";
import { defaultMark } from "@/lib/types";
import { createBookmarkAction } from "@/lib/actions";
import { defaultCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mark = searchParams.get("mark");
    const title = searchParams.get("title") || "Untitled";
    const url = searchParams.get("url");
    // 验证必要参数
    if (!mark) {
      return NextResponse.redirect(
        new URL(
          `/${defaultMark}?status=error&message=markRequired`,
          request.url
        )
      );
    }
    if (!url) {
      return NextResponse.redirect(
        new URL(`/${mark}?status=error&message=urlRequired`, request.url)
      );
    }

    const formData = new FormData();
    formData.append("mark", mark);
    formData.append("url", url);
    formData.append("title", title);
    formData.append("category", defaultCategory);

    const [data, err] = await createBookmarkAction(formData);

    if (!data) {
      return NextResponse.redirect(
        new URL(`/${mark}?status=error&message=${err.message}`, request.url)
      );
    }

    return NextResponse.redirect(
      new URL(`/${mark}?status=success&message=bookmarkAdded`, request.url)
    );
  } catch (error) {
    console.error("Error processing bookmark:", error);
    return NextResponse.redirect(
      new URL(
        `/${defaultMark}?status=error&message=processingError`,
        request.url
      )
    );
  }
}
