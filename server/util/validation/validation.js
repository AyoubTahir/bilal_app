export const validate = async (schema, body) => {
  try {
    await schema.validate(body, { abortEarly: false });
    return {
      isValid: true,
      errors: {},
    };
  } catch (err) {
    let errorsBag = {};
    err.inner.forEach((e) => {
      if (Object.keys(body).includes(e.path)) {
        if (errorsBag[e.path]) errorsBag[e.path] = [...errorsBag[e.path], e.message];
        else errorsBag[e.path] = [e.message];
      }
    });

    return {
      isValid: false,
      errors: errorsBag,
    };
  }
};
