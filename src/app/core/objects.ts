// import { DropdownInputItemModel } from "./models"
export class Objects {
    public baseColourList = [
        { id: 0x6D6C6E, value: 'Basalt' },
        { id: 0xE9DCB8, value: 'Classic Cream' },
        { id: 0x304C3C, value: 'Cottage Green' },
        { id: 0xA59F8A, value: 'Cove' },
        { id: 0x364152, value: 'Deep Ocean' },
        { id: 0xB1ADA3, value: 'Dune' },
        { id: 0xC5C2AA, value: 'Evening Haze' },
        { id: 0x857E73, value: 'Gully' },
        { id: 0x3E434C, value: 'Ironstone' },
        { id: 0x6C6153, value: 'Jasper' },
        { id: 0x737562, value: 'Mangrove' },
        { id: 0x5E1D0E, value: 'Manor Red' },
        { id: 0x323233, value: 'Monument' },
        { id: 0x000000, value: 'Night Sky' },
        { id: 0x7C846A, value: 'Pale Eucalypt' },
        { id: 0xCABFA4, value: 'Paperbark' },
        { id: 0xBDBFBA, value: 'Shale Grey' },
        { id: 0xE4E2D5, value: 'Surfmist' },
        { id: 0x67432E, value: 'Terrain' },
        { id: 0x7F7C78, value: 'Wallaby' },
        { id: 0xd8e5e6, value: 'White' },
        { id: 0x888B8A, value: 'Windspray' },
        { id: 0x4B4C46, value: 'Woodland Grey' },
        { id: 0xFCFFFF, value: 'Zinc'}
    ];
    public postColourList = [
        { id: 0x000000, value: 'Black' },
        { id: 0xE9DCB8, value: 'Cream' },
        { id: 0xE4E2D5, value: 'Surfmist' },
        { id: 0xCABFA4, value: 'Paperbark' }
    ];
    public rakeCutTypeList = [
        { id: 0, value: 'None' },
        { id: 1, value: 'A' },
        { id: 2, value: 'B' },
        { id: 3, value: 'C' },
        { id: 4, value: 'D' }
    ];
    public downpipeColourList = [
        { id: 0xd8e5e6, value: 'White' }
    ];
    public flyoverColourList = [
        { id: 0xd8e5e6, value: 'Non Standard Colour' },
        { id: 0x000000, value: 'Black' },
        { id: 0xE9DCB8, value: 'Cream' },
        { id: 0xE4E2D5, value: 'Surfmist' },
        { id: 0xCABFA4, value: 'Paperbark' }
    ];
    public existingRoofPitchList = [
        { id: 3, value: '3' },
        { id: 5, value: '5' },
        { id: 7.5, value: '7.5' },
        { id: 10, value: '10' },
        { id: 12.5, value: '12.5' },
        { id: 15, value: '15' },
        { id: 17.5, value: '17.5' },
        { id: 20, value: '20' },
        { id: 22.5, value: '22.5' },
        { id: 25, value: '25' },
        { id: 30, value: '30' }
    ];
    public roofPitchList = [
        { id: 2, value: '2' },
        { id: 3, value: '3' },
        { id: 5, value: '5' },
        { id: 7.5, value: '7.5' },
        { id: 10, value: '10' }
    ];
    public wallList = [
        {id: 0, value: 'Bricks'}
    ];
    public structureTypeList = [
        { id: 0, value: 'Existing Building' },
        { id: 1, value: 'Fly Over' },
        { id: 2, value: 'Back Fly Over' },
        { id: 3, value: 'Fascia Connection' },
        { id: 4, value: 'Free Standing' },
    ];
    public existingTypeList = [
        { id: 0, value: 'None' },
        { id: 1, value: 'Left' },
        { id: 2, value: 'Right' },
        { id: 3, value: 'Both' },
    ];
    public windClassList = [
        { id: 0, value: 'N2(W33)' },
        { id: 1, value: 'N3(W41)' },
        { id: 2, value: 'N4(W50)' },
        { id: 3, value: 'C1(W41)' },
        { id: 4, value: 'C2(W50)' },
        { id: 5, value: 'C3(W60)' }
    ];
    public roofSheetingTypeList = [
        { id: 0, value: 'Coolaspan Trimspan' },
        { id: 1, value: 'Monopanel' },
        { id: 2, value: 'Corropanel' }
    ];
    public flatBottomList = [
        { id: 0, value: 'Surfmist/Off White flat bottom' },
        { id: 1, value: 'Classic Cream bottom' }
    ];
    public downpipeTypeList = [
        { id: 0, value: '90mm PVC' }
    ];
    public thicknessList = [
        { id: 0, value: 'N/A' },
        { id: 1, value: '50mm' },
        { id: 2, value: '75mm' },
        { id: 3, value: '100mm' },
        { id: 4, value: '125mm' },
        { id: 5, value: '150mm' }
    ];
    public gutterTypeList = [
        { id: 0, value: 'Gutter Square Line' },
        { id: 1, value: 'Quad 150 Low Front Gutter Unslotted' },
        { id: 2, value: 'Quad 150 Hi Front Gutter Slotted' }
    ];
    public beamTypeList = [
        { id: 0, value: 'SUPERIOR BEAMS' },
        { id: 1, value: 'TIMBER' }
    ];
    public beamSizeList = [
        { id: 0, value: 'N/A' },
        { id: 1, value: 'SB110' },
        { id: 2, value: 'SB160' },
        { id: 3, value: 'SB210' },
        { id: 4, value: 'SB260' }
    ];
    public columnTypeList = [
        { id: 0, value: 'Superior Post 65mm x 65mm' },
        { id: 1, value: 'Superior 90 x 90 Aluminium Post' },
        { id: 2, value: 'Superior Post RHS 90mm x 90mm x 3.5mm' },
        { id: 3, value: 'Timber' }
    ];
    public baseFixingTypeList = [
        { id: 0, value: 'Dynabolt' },
        { id: 1, value: 'Post In Ground' }
    ];
}
