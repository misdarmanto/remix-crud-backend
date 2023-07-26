import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UsersAttributes, UsersModel } from "../../models/users";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { ProvinceAttributes, ProvinceModel } from "../../models/province";
import { KabupatenAttributes, KabupatenModel } from "../../models/kabupaten";
import { KecamatanAttributes, KecamatanModel } from "../../models/kecamatan";
import { DesaAttributes, DesaModel } from "../../models/desa";

const desaList = [
	{
		id: "3325120001",
		district_id: "3325120",
		name: "PANDANSARI",
	},
	{
		id: "3325120002",
		district_id: "3325120",
		name: "KALIWARENG",
	},
	{
		id: "3325120003",
		district_id: "3325120",
		name: "PEJAMBON",
	},
	{
		id: "3325120004",
		district_id: "3325120",
		name: "SARIGLAGAH",
	},
	{
		id: "3325120005",
		district_id: "3325120",
		name: "PESAREN",
	},
	{
		id: "3325120006",
		district_id: "3325120",
		name: "SIDOREJO",
	},
	{
		id: "3325120007",
		district_id: "3325120",
		name: "CEPAGAN",
	},
	{
		id: "3325120008",
		district_id: "3325120",
		name: "MASIN",
	},
	{
		id: "3325120009",
		district_id: "3325120",
		name: "BANJIRAN",
	},
	{
		id: "3325120010",
		district_id: "3325120",
		name: "WARUNGASEM",
	},
	{
		id: "3325120011",
		district_id: "3325120",
		name: "GAPURO",
	},
	{
		id: "3325120012",
		district_id: "3325120",
		name: "KALIBELUK",
	},
	{
		id: "3325120013",
		district_id: "3325120",
		name: "SAWAHJOHO",
	},
	{
		id: "3325120014",
		district_id: "3325120",
		name: "CANDIARENG",
	},
	{
		id: "3325120015",
		district_id: "3325120",
		name: "LEBO",
	},
	{
		id: "3325120017",
		district_id: "3325120",
		name: "TERBAN",
	},
	{
		id: "3325120018",
		district_id: "3325120",
		name: "SIJONO",
	},
];

export const createRegion = async (req: any, res: Response) => {
	try {
		// const newData = <DesaAttributes[]>desaList.map((item, index) => {
		// 	return {
		// 		desaName: item.name,
		// 		desaId: `11415${index + 1}`,
		// 		kecamatanId: `11415`,
		// 		kabupatenId: "14",
		// 		provinceId: "1",
		// 	};
		// });

		// await DesaModel.bulkCreate(newData);

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = { message: "success" };
		return res.status(StatusCodes.CREATED).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
