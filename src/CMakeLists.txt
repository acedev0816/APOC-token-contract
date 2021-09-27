project(apoc)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( apoc apoc apoc.cpp )
target_include_directories( apoc PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( apoc ${CMAKE_SOURCE_DIR}/../ricardian )