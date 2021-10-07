add_contract(apoc.token apoc.token ${CMAKE_CURRENT_SOURCE_DIR}/src/apoc.token.cpp)

target_include_directories(apoc.token
   PUBLIC
   ${CMAKE_CURRENT_SOURCE_DIR}/include)

set_target_properties(apoc.token
   PROPERTIES
   RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}")

configure_file( ${CMAKE_CURRENT_SOURCE_DIR}/ricardian/apoc.token.contracts.md.in ${CMAKE_CURRENT_BINARY_DIR}/ricardian/apoc.token.contracts.md @ONLY )

target_compile_options( apoc.token PUBLIC -R${CMAKE_CURRENT_SOURCE_DIR}/ricardian -R${CMAKE_CURRENT_BINARY_DIR}/ricardian )