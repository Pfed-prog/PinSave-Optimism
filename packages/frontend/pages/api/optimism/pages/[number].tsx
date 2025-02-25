import type { NextApiRequest, NextApiResponse } from "next";
import { Contract, InfuraProvider } from "ethers";

import { fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { number } = req.query;
    const pageNumber = Number(number);

    const { address, abi } = getContractInfo();

    const provider = new InfuraProvider(
      "optimism",
      process.env.NEXT_PUBLIC_INFURA_OPTIMISM,
    );

    const contract = new Contract(address, abi, provider);

    const totalSupply = Number(await contract.totalSupply());

    let items = [];
    let result;

    var upperLimit = 6 * pageNumber;

    const lowerLimit = upperLimit - 6 + 1;

    if (totalSupply < upperLimit) {
      upperLimit = totalSupply;
    }

    try {
      for (let i = lowerLimit; upperLimit >= i; i++) {
        result = await contract.getPostCid(i);
        const item = await fetchDecodedPost(result, 500);

        items.push({ tokenId: i, ...item });
      }
    } catch {
      res.status(200).json({ items: items, totalSupply: totalSupply });
    }

    res.status(200).json({ items: items, totalSupply: totalSupply });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch data" + err });
  }
}
