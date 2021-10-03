const Errors = {
    COR_01: "Inavid CountyID",
    COR_02: "County already exists",
    COR_03: "County name is required",
    COR_04: "County region is required",
    COR_05: "County address is required",
    COR_06: "County code is required",
    COR_07: "County location is required"
};

export const handleCountyErrors = (code, status, field) => {
    return {
      error: true,
      status,
      field,
      code: code,
      message: Errors[code],
    };
  };
  
