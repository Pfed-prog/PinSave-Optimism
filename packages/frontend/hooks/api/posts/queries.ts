import type { ChainName } from "@/constants/chains";
import fetcher from "@/utils/fetcher";

export const postKeys = {
  byChain: (chain: ChainName) => [chain] as const,
  single: (chain: ChainName, id: string) => [chain, id] as const,
};

export const fetchPosts = async (
  chain: ChainName,
  { pageParam = 1 }: { pageParam?: number } = {},
) => {
  try {
    const apiRoute: string = `/api/${chain}/pages/${pageParam}`;
    return await fetcher(apiRoute);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchPost = async (chain: ChainName, id: string) => {
  try {
    return await fetcher(`/api/${chain}/posts/${id}`);
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
