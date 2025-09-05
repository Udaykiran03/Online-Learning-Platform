import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import searchService from "../../services/searchService";
import Sidebar from "../../components/Search/sidebar";
import cn, { capitalize } from "../../../lib/utils";
import Button from "../../components/ui/button";

const Search = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const collections = [
    { collection: "Student" },
    { collection: "Teacher" },
    { collection: "Department" },
    { collection: "Course" },
    { collection: "Video" },
    { collection: "Note" },
  ];

  const tabs = [
    {
      display: "Departments based on Teachers and Courses",
      collections: ["Teacher", "Course", "Department"],
    },
    {
      display: "Courses based on Notes and Videos",
      collections: ["Note", "Video", "Course"],
    },
    {
      display: "Videos based on Courses and Teachers",
      collections: ["Teacher", "Course", "Video"],
    },
    {
      display: "Students enrolled based on Courses and Teachers",
      collections: ["Course", "Teacher", "Student"],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  const [results, setResults] = useState({ data: [], loading: false });

  useEffect(() => {
    setResults({ data: [], loading: true });
    reset();
    setResults({ data: [], loading: false });
  }, [activeTab]);

  const onSubmit = async (data) => {
    setResults({ data: [], loading: true });

    const queryString = Object.entries(data)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    await searchService
      .getSearch(queryString)
      .then((res) => {
        setResults({ data: res, loading: false });
      })
      .catch(() => {
        setResults({ data: [], loading: false });
      });
  };

  const handleSearchAll = async () => {
    reset();
    setResults({ data: [], loading: true });

    const queryString = tabs[activeTab].collections
      .map((collection) => `${encodeURIComponent(collection)}`)
      .join("&");

    await searchService
      .getSearch(queryString)
      .then((res) => {
        setResults({ data: res, loading: false });
      })
      .catch(() => {
        setResults({ data: [], loading: false });
      });
  };

  return (
    <div className="flex flex-col w-full">
      <section className="flex justify-between items-center">
        <h1 className="p-10 bg-gray-200 w-full relative">Search</h1>
        <div className="absolute right-5">
          <Button onClick={handleSearchAll} className="bg-gray-200">
            Search All
          </Button>
        </div>
      </section>

      <section className="h-full flex relative">
        <Sidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 ml-64 flex justify-center">
          <div className="w-full flex flex-col gap-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full flex justify-evenly pt-5">
                {tabs[activeTab].collections.map((collection, index) => (
                  <div key={index}>
                    <select
                      disabled
                      value={tabs[activeTab].collections[index]}
                      className="border rounded w-fit p-2"
                    >
                      {collections.map((collection, i) => (
                        <option key={i} value={collection.collection}>
                          {collection.collection}
                        </option>
                      ))}
                    </select>
                    <input
                      {...register(`${tabs[activeTab].collections[index]}`, {
                        required: index < 2,
                        minLength: index < 3 ? 2 : 0,
                      })}
                      placeholder={`Search ${tabs[activeTab].collections[index]}`}
                      className={cn(
                        "border px-3 py-2 rounded mt-2 focus:outline-none",
                        errors[`${tabs[activeTab].collections[index]}`] &&
                          "border-red-500"
                      )}
                    />
                    {errors[`${tabs[activeTab].collections[index]}`] && (
                      <p className="text-red-500 text-xs text-right">
                        {errors[`${tabs[activeTab].collections[index]}`]
                          .type === "required"
                          ? "This field is required."
                          : "Minimum 2 characters required."}
                      </p>
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  className="ml-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-800"
                >
                  Search
                </button>
              </div>
            </form>
            <div
              className={cn(
                "results overflow-y-auto h-fit px-5 flex items-center justify-center"
              )}
            >
              {results.loading ? (
                <div>Loading...</div>
              ) : results.data.length !== 0 ? (
                <div className="flex gap-10 flex-wrap py-8">
                  {results.data.map((item, i) => (
                    <div
                      className={cn(
                        "flex flex-col bg-sky-100 rounded-xl cursor-pointer p-4 w-[400px] transition shadow-md hover:shadow-lg hover:scale-105"
                      )}
                      key={i}
                    >
                      <div
                      // className={`grid grid-rows-${
                      //   Object.entries(item).length
                      // }`}
                      >
                        {Object.entries(item).map(([key, value], index) => (
                          <div
                            className="grid grid-cols-7 items-center justify-between text-wrap"
                            key={index}
                          >
                            <span className="font-bold col-span-2 mt-1">
                              {capitalize(key)}:{item.length}
                            </span>{" "}
                            <span className="col-span-5 text-right mt-1">
                              {Array.isArray(value)
                                ? value !== ""
                                  ? capitalize(value.join(", "))
                                  : "N/A"
                                : value !== "" || undefined || null
                                ? capitalize(value)
                                : "N/A"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="!h-60">Search for results / No results</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
