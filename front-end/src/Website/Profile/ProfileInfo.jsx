import Select from "react-select";
import countries from "world-countries";

export default function ProfileInfo({ formData, handleChange, editMode }) {
  // Convert country data to { value, label } format with flag
  const countryOptions = countries.map((country) => ({
    value: country.cca2, // Country code (e.g., US, EG)
    label: (
      <div className="d-flex align-items-center">
        <img
          src={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`}
          alt={country.name.common}
          width="20"
          className="me-2"
        />
        {country.name.common}
      </div>
    ),
  }));

  return (
    <div className="row g-3 mt-4">
      {["name", "email"].map((field) => (
        <div className="col-md-6" key={field}>
          <label className="form-label text-capitalize">{field}</label>
          <input
            type={field === "email" ? "email" : "text"}
            className="form-control"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            disabled={!editMode}
            required={field === "email"} // Optional: forces email field to be filled if inside a form
          />
        </div>
      ))}

      {/* Gender Field as Select */}
      <div className="col-md-6">
        <label className="form-label">Gender</label>
        <select
          className="form-select"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={!editMode}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Age Field */}
      <div className="col-md-6">
        <label className="form-label">Age</label>
        <input
          type="number"
          className="form-control"
          name="age"
          value={formData.age}
          onChange={handleChange}
          disabled={!editMode}
          min={18}
        />
      </div>

      {/* Country Field */}
      <div className="col-md-6">
        <label className="form-label">Country</label>
        <Select
          options={countryOptions}
          name="country"
          placeholder="Select your country"
          isDisabled={!editMode}
          value={countryOptions.find(
            (option) => option.value === formData.country
          )}
          onChange={(selectedOption) =>
            handleChange({
              target: {
                name: "country",
                value: selectedOption.value,
              },
            })
          }
        />
      </div>
    </div>
  );
}
